# Stage 1:Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Stage 2: Server the app with Nginx
FROM nginx:alpine
#Copy the 'dist' folder from the build stage to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html
#Expose port 80 for the web server
EXPOSE 80
CMD ["nginx","-g","daemon off;"]