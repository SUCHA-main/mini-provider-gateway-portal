import { Router } from 'express';
import { consumerAuth } from '../middleware/consumerAuth.js';
import * as providerService from '../services/providerService.js';
import * as logService from '../services/logService.js';
import { callProvider } from '../providers/openaiCompatibleAdapter.js';
import { callOllama } from '../providers/ollamaAdapter.js';
import { generateRequestId } from '../utils/requestId.js';

const router = Router();

async function handleProxy(req, res) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  const { providerId, model, messages, temperature, max_tokens } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { message: 'messages array is required', type: 'invalid_request', request_id: requestId } });
  }

  let provider;
  const headerProviderId = req.headers['x-provider-id'];
  const effectiveProviderId = headerProviderId ? parseInt(headerProviderId, 10) : providerId;

  if (effectiveProviderId) {
    provider = providerService.getById(effectiveProviderId);
    if (!provider || !provider.enabled) {
      return res.status(400).json({ error: { message: `Provider ${effectiveProviderId} not found or disabled`, type: 'provider_error', request_id: requestId } });
    }
  } else {
    const enabled = providerService.getEnabled();
    if (enabled.length === 0) {
      return res.status(400).json({ error: { message: 'No enabled providers', type: 'provider_error', request_id: requestId } });
    }
    provider = enabled[0];
  }

  const consumer = req.consumer;
  if (consumer.allowed_provider_ids) {
    const allowed = JSON.parse(consumer.allowed_provider_ids);
    if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(provider.id)) {
      return res.status(403).json({ error: { message: 'Provider not allowed for this consumer', type: 'auth_error', request_id: requestId } });
    }
  }

  try {
    let result;
    const proxyBody = { model, messages, temperature, max_tokens };
    if (provider.type === 'ollama') {
      result = await callOllama(provider, proxyBody);
    } else {
      result = await callProvider(provider, proxyBody);
    }

    const latency = Date.now() - startTime;
    const usage = result.usage || {};

    logService.create({
      request_id: requestId,
      consumer_id: consumer.id,
      provider_id: provider.id,
      provider_type: provider.type,
      model: model || provider.default_model,
      route: req.path,
      status: 'success',
      http_status: 200,
      latency_ms: latency,
      input_tokens: usage.prompt_tokens || null,
      output_tokens: usage.completion_tokens || null,
      total_tokens: usage.total_tokens || null,
    });

    res.json(result);
  } catch (err) {
    const latency = Date.now() - startTime;
    logService.create({
      request_id: requestId,
      consumer_id: consumer.id,
      provider_id: provider.id,
      provider_type: provider.type,
      model: model || provider.default_model,
      route: req.path,
      status: 'error',
      http_status: 502,
      latency_ms: latency,
      error_code: 'provider_error',
      error_message: err.message?.slice(0, 500) || 'Unknown error',
    });

    res.status(502).json({
      error: {
        message: 'Provider request failed',
        type: 'provider_error',
        request_id: requestId,
        provider_id: provider.id,
        detail: err.message?.slice(0, 200) || 'Unknown error',
      },
    });
  }
}

router.post('/proxy/chat', consumerAuth, handleProxy);
router.post('/v1/chat/completions', consumerAuth, handleProxy);

export default router;
