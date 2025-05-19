# --- Build Stage ---
    FROM node:18-alpine AS builder

    # Ажлын директор
    WORKDIR /app
    
    # Зависимосууд суулгах
    COPY package*.json ./
    RUN npm install
    
    # Кодыг хуулж, build хийх
    COPY . .
    RUN npm run build
    
    # --- Production Stage ---
    FROM nginx:alpine
    
    # Vite бүтээсэн файлуудыг Nginx рүү хуулна
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Порт нээх
    EXPOSE 80
    
    # Nginx-г ажиллуулах
    CMD ["nginx", "-g", "daemon off;"]
    