pipeline {
    agent any
    tools {
        nodejs 'NodeJS_20'
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
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        echo "Testing the Node.js application..."
                        sh 'node -v'
                        sh 'npm -v'
                        sh 'npm install'
                        sh 'npm test'
                    }
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
                    echo "Tagging Docker image..."
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
                }
            }
        }

        stage('Verify Docker Image') {
            steps {
                script {
                    echo "Verifying Docker image locally..."
                    sh "docker image inspect $DOCKER_IMAGE:$DOCKER_TAG > /dev/null"
                }
            }
        }
                 stage('Start Minikube') {
            steps {
                script {
                    // Download and install Minikube if not already installed
                    sh '''
                        if ! command -v minikube &> /dev/null; then
                            curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
                            sudo install minikube-linux-amd64 /usr/local/bin/minikube
                        fi
        
                        # Ensure /usr/local/bin is in PATH
                        export PATH=$PATH:/usr/local/bin
        
                        # Start Minikube if not running
                        minikube status || minikube start --driver=docker
                        minikube version
                    '''
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
