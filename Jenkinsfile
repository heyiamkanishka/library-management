pipeline {
    agent any

    tools {
        gradle 'Gradle'   // We'll configure this in Jenkins later
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/heyiamkanishka/library-management.git'
            }
        }

        stage('Build with Gradle') {
            steps {
                sh './gradlew clean build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker buildx build --load -t library-management:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    // Stop and remove old container if exists
                    sh 'docker stop my-library-app || true'
                    sh 'docker rm my-library-app || true'
                    
                    // Start new container
                    sh 'docker run -d -p 8080:8080 --name my-library-app library-management:${BUILD_NUMBER}'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Success! Application is deployed.'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}