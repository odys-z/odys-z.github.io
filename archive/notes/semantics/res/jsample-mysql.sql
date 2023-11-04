-- auto key
CREATE TABLE oz_autoseq (
  sid varchar2(20),
  seq long,
  remarks varchar2(200),
  CONSTRAINT oz_autoseq_pk PRIMARY KEY (sid)
);

-- the autoseq helper
CREATE FUNCTION oz_fIncSeq(seqId varchar(20), prefix varchar(20)) RETURNS int(11)
begin
  DECLARE seqName varchar(20);
	DECLARE cnt long DEFAULT 0;

	if prefix = '' then set seqName = seqId;
	else set seqName = concat(seqId, '.', prefix);
	end if;

	select count(seq) into cnt from ir_autoSeqs where sid = seqName;

	if cnt = 0
	then
		insert into ir_autoSeqs(sid, seq, remarks) values (seqName, 0, now());
	end if;

	select seq into cnt from ir_autoSeqs where sid = seqName;
	update ir_autoSeqs set seq = cnt + 1 where sid = seqName;
	return cnt;
end
/*
select oz_fIncSeq('test.cn', '') newId from dual;
*/
