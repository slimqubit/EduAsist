@Echo Off

start cmd.exe /K "CD /D D:\Local_REPO\EduAsist\eduasist_backend && echo Running 'nodemon server.js' to start the server && nodemon server.js"
start cmd.exe /K "CD /D D:\Local_REPO\EduAsist\eduasist_frontend && echo Run 'npm run build' to build the app! && npm run dev"
start http://localhost:5173/