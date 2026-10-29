from django.test import SimpleTestCase


class HealthCorsTests(SimpleTestCase):
    def test_local_web_origin_can_read_health(self):
        response = self.client.get('/api/health/', HTTP_ORIGIN='http://localhost:8081')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})
        self.assertEqual(response['Access-Control-Allow-Origin'], 'http://localhost:8081')
        self.assertIn('Origin', response['Vary'])

    def test_other_origin_is_not_allowed(self):
        response = self.client.get('/api/health/', HTTP_ORIGIN='https://example.invalid')
        self.assertNotIn('Access-Control-Allow-Origin', response)

    def test_other_routes_do_not_get_cors_headers(self):
        response = self.client.get('/not-a-route/', HTTP_ORIGIN='http://localhost:8081')
        self.assertNotIn('Access-Control-Allow-Origin', response)
