"""세심마을 로컬 서버 (캐시 없이 실행) — 사용법: python serve.py [포트]
브라우저에서 http://localhost:5230 을 열어요."""
import http.server, os, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5230
    print('세심마을: http://localhost:%d' % port)
    http.server.ThreadingHTTPServer(('', port), NoCache).serve_forever()
