pipeline {
    agent any
    tools {
        nodejs 'NodeJS_20'
    }

    environment {
        DOCKER_IMAGE = "rukevweubio/nodejs-app"
        DOCKER_TAG   = "latest"
        PATH = "$HOME/bin:/usr/local/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Test Node.js App') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        echo "Testing Node.js app..."
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
                sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }

        stage('Install Kind') {
            steps {
                sh '''
                    mkdir -p $HOME/bin
                    curl -Lo $HOME/bin/kind https://kind.sigs.k8s.io/dl/v0.25.0/kind-linux-amd64
                    chmod +x $HOME/bin/kind
                    kind version
                '''
            }
        }

        stage('Create Kind Cluster') {
            steps {
                sh '''
                    kind delete cluster --name jenkins-demo || true
                    kind create cluster --name jenkins-demo
                    kubectl cluster-info --context kind-jenkins-demo
                '''
            }
        }

        stage('Load Docker Image into Kind') {
            steps {
                sh 'kind load docker-image $DOCKER_IMAGE:$DOCKER_TAG --name jenkins-demo'
            }
        }

        stage('Deploy to Kind') {
            steps {
                sh '''
                    ls -R 
                    kubectl apply -f K8/deployment.yaml
                    kubectl apply -f K8/service.yaml
                     kubectl get pods -o wide
                    kubectl describe pods
                    kubectl logs -l app=nodejs-app
                    
                '''
            }
        }

        stage('Pause for Inspection') {
            steps {
                echo "Cluster is ready. Press Enter in the terminal to continue..."
              sh '''
                        echo "Press Enter to continue..."
                        read dummy
                    '''

            }
        }
    }

    post {
        always {
            echo "Cluster is still running. Delete manually when done: kind delete cluster --name jenkins-demo"
        }
    }
}
