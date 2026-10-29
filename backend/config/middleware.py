class LocalHealthCorsMiddleware:
    """Allow the local web prototype to read only the public health endpoint."""

    allowed_origins = {"http://localhost:8081", "http://127.0.0.1:8081"}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        origin = request.headers.get("Origin")
        if request.path == "/api/health/":
            from django.utils.cache import patch_vary_headers

            patch_vary_headers(response, ["Origin"])
            if origin in self.allowed_origins:
                response["Access-Control-Allow-Origin"] = origin
        return response
