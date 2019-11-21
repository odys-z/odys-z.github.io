-- auto key
CREATE TABLE "oz_autoseq" (
  "sid" varchar2(20),
  "seq" long,
  "remarks" varchar2(200),
  CONSTRAINT oz_autoseq_pk PRIMARY KEY ("sid")
);

-- the autoseq helper
CREATE OR REPLACE FUNCTION "oz_fIncSeq" (seqId in varchar, prefix in varchar) RETURN integer
IS
	PRAGMA AUTONOMOUS_TRANSACTION;
	seqName varchar(100);
	cnt integer DEFAULT 0;
begin
	if prefix = '' then seqName := seqId;
	else seqName := concat(concat(seqId, '.'), prefix);
	end if;

	select count("sid") into cnt from "oz_autoseq" where "sid" = seqName;

	if cnt = 0
	then
		insert into "oz_autoseq"("sid", "seq", "remarks")
			values (seqName, 0, to_char(sysdate, 'MM-DD-YYYY HH24:MI:SS'));
		commit;
	end if;

	select "seq" into cnt from "oz_autoseq" where "sid" = seqName;
	update "oz_autoseq" set "seq" = cnt + 1, "remarks" = to_char(sysdate, 'MM-DD-YYYY HH24:MI:SS')
		where "sid" = seqName;
	commit;
	return cnt;
end;

CREATE TABLE "a_functions" (
	"funcId" VARCHAR2(20),
	"funcName" VARCHAR2(20),
	"parentId" VARCHAR2(20),
	"sort" NUMBER(22,0),
	"fullpath" VARCHAR2(50),
	CONSTRAINT a_functions PRIMARY KEY ("funcId")
) ;

/*
select "oz_fIncSeq" ('test.cn', '') newId from dual;
*/

-- Create testing data for 3d visualization
CREATE TABLE "b_reports" (
	"repId" VARCHAR2(20) NOT NULL,
	"stamp" DATE,
	"areaId" VARCHAR2(20) NOT NULL,
	"ignored" int,
	CONSTRAINT b_repId PRIMARY KEY ("repId")
);

-- report's records
CREATE TABLE "b_reprecords" (
	"recId" VARCHAR2(20) NOT NULL,
	"stamp" DATE,
	"deviceId" VARCHAR2(20) NOT NULL,
	"repId" VARCHAR2(20) NOT NULL,
	"val" VARCHAR2(50),
	CONSTRAINT b_recId PRIMARY KEY ("recId")
) ;
