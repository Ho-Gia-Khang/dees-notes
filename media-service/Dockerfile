FROM node:22-alpine

WORKDIR /src

# Delete node_modules and package-lock.json for a clean install
# RUN rm -rf node_modules

COPY . .

RUN npm install 

EXPOSE 9999
CMD ["dev"]