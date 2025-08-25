pipeline {
   agent any
     tools {
        nodejs 'NodeJS_20'   // Must match the name you set
    }

    environment {
        DOCKER_IMAGE = "rukevweubio/nodejs-app"
        DOCKER_TAG   = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Node.js App') {
            steps {
                steps {
               echo "  test teh nodejs application"
                sh 'node -v'
                sh 'npm -v'
                sh 'npm install'
                sh 'npm test'
            }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    echo "Tagging Docker image $DOCKER_IMAGE:$DOCKER_TAG..."
                    sh "docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing image to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
                    }
                }
            }
        }

        stage('Pull Docker Image from Docker Hub') {
            steps {
                script {
                    echo "Pulling image from Docker Hub..."
                    sh "docker pull $DOCKER_IMAGE:$DOCKER_TAG"
                    echo "Image pulled successfully!"
                }
            }
        }

        stage('Verify Docker Image') {
            steps {
                script {
                    echo "Verifying if Docker image exists locally..."
                    sh "docker image inspect $DOCKER_IMAGE:$DOCKER_TAG > /dev/null"
                }
            }
        }

        stage('Start Minikube') {
            steps {
                script {
                    sh "minikube status || minikube start --driver=docker"
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    echo "Deploying to Minikube..."
                    sh "kubectl apply -f k8/deployment.yaml"
                    sh "kubectl apply -f k8/service.yaml"
                    sh "kubectl rollout status deployment/nodejs-app"
                }
            }
        }
    }
}
