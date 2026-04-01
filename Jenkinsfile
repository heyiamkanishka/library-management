pipeline {
    agent any

    tools {
        gradle 'Gradle'
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
                sh 'docker build -t library-management:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    // Stop and remove old container
                    sh 'docker stop my-library-app || true'
                    sh 'docker rm my-library-app || true'
                    
                    // Run new container
                    sh 'docker run -d -p 8080:8080 --name my-library-app library-management:${BUILD_NUMBER}'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Success! Application deployed on port 8080'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}