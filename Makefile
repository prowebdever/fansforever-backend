ldeploy:
	GIT7_HASH=`git rev-parse --short HEAD` docker-compose --context default up -V --build

ldestroy:
	GIT7_HASH=`git rev-parse --short HEAD` docker-compose --context default down

sdeploy:
	GIT7_HASH=`git rev-parse --short HEAD` docker-compose --env-file=./.env.stag --context fan-staging up -V --build -d

pdeploy:
	GIT7_HASH=`git rev-parse --short HEAD` docker-compose --env-file=./.env.prod --context fan up -V --build -d

sdestroy:
	GIT7_HASH=`git rev-parse --short HEAD` docker-compose --context fan-staging down

pdestroy:
	GIT7_HASH=`git rev-parse --short HEAD` docker-compose --context fan down
