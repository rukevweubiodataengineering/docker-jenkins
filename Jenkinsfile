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

        stage('Start Minikube') {
            steps {
                script {
                    sh '''
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
                    sh '''
                        export PATH=$PATH:/usr/local/bin
                        kubectl apply -f k8/deployment.yaml
                        kubectl apply -f k8/service.yaml
                        kubectl rollout status deployment/nodejs-app
                        kubectl get pods
                    '''
                }
            }
        }
    }
}
