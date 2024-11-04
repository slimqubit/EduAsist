@Echo Off

start cmd.exe /K "CD /D D:\repos\EduAsist\eduasist_backend && nodemon server.js"
start cmd.exe /K "CD /D D:\repos\EduAsist\eduasist_frontend && npm run dev"
start http://localhost:5173/