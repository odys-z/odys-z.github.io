-- Create testing data for 3d visualization
CREATE TABLE "b_reports" (
	"repId" VARCHAR2(20) NOT NULL,
	"stamp" DATE,
	"areaId" VARCHAR2(20) NOT NULL,
	"ignored" int,
	CONSTRAINT b_repId PRIMARY KEY ("repId")
);
CREATE UNIQUE INDEX b_repId ON "b_reports" ("repId") ;

-- report's records 
CREATE TABLE "b_reprecords" (
	"recId" VARCHAR2(20) NOT NULL,
	"stamp" DATE,
	"deviceId" VARCHAR2(20) NOT NULL,
	"repId" VARCHAR2(20) NOT NULL,
	"val" VARCHAR2(50),
	CONSTRAINT b_recId PRIMARY KEY ("recId")
) ;
CREATE UNIQUE INDEX b_recId ON "b_reprecords" ("recId") ;
