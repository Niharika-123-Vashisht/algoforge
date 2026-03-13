"""Custom exception handling for consistent API responses."""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def _flatten_validation_errors(data):
    """Turn DRF validation dict/list into a single human-readable string."""
    if data is None:
        return None
    if isinstance(data, str):
        return data
    if isinstance(data, list):
        parts = []
        for item in data:
            if isinstance(item, dict):
                parts.append(_flatten_validation_errors(item) or str(item))
            else:
                parts.append(str(item))
        return ' '.join(parts) if parts else None
    if isinstance(data, dict):
        parts = []
        for key, val in data.items():
            if isinstance(val, list):
                parts.append(f"{key}: {val[0]}" if val else key)
            elif isinstance(val, dict):
                nested = _flatten_validation_errors(val)
                if nested:
                    parts.append(f"{key}: {nested}")
            else:
                parts.append(f"{key}: {val}")
        return '; '.join(parts) if parts else None
    return str(data)


def custom_exception_handler(exc, context):
    """Return consistent error format: { "error": "...", "detail": ... }."""
    response = exception_handler(exc, context)
    if response is not None:
        raw = response.data
        # Prefer string detail; otherwise flatten field errors so clients never get generic message
        if isinstance(raw, dict) and 'detail' in raw:
            err = raw['detail']
        else:
            err = raw
        if isinstance(err, dict):
            message = _flatten_validation_errors(err) or 'Validation failed.'
        elif isinstance(err, list):
            message = _flatten_validation_errors(err) or 'Validation failed.'
        else:
            message = err if err is not None else 'An error occurred'
        if isinstance(message, list):
            message = ' '.join(str(x) for x in message)
        custom = {
            'error': message,
            'detail': raw if isinstance(raw, dict) else {'detail': raw},
        }
        response.data = custom
    else:
        response = Response(
            {'error': str(exc), 'detail': {}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return response
