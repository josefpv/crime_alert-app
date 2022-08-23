docker build -t josefvivas/crime-alert-client:latest -t josefvivas/crime-alert-client:$SHA -f ./client/Dockerfile ./client
docker build -t josefvivas/crime-alert-server:latest -t josefvivas/crime-alert-server:$SHA -f ./api/Dockerfile ./api

docker push josefvivas/crime-alert-client:latest
docker push josefvivas/crime-alert-server:latest

docker push josefvivas/crime-alert-client:$SHA
docker push josefvivas/crime-alert-server:$SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=josefvivas/crime-alert-server:$SHA
kubectl set image deployments/client-deployment client=josefvivas/crime-alert-client:$SHA