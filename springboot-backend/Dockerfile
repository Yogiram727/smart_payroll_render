# Build stage
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
# We use 'mvn' instead of './mvnw' to avoid permission issues
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-alpine
COPY --from=build /target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]