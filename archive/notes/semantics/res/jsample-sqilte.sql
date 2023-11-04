
CREATE TABLE a_logs (
  logId text(20) NOT NULL,
  funcId text(20),
  funcName text(50),
  oper text(20),
  logTime text(20),
  cnt INTEGER,
  txt text(4000),
  CONSTRAINT oz_logs_pk PRIMARY KEY (logId));


CREATE TABLE a_domain (
  domainId text(40) NOT NULL,
  parentId text(40),
  domainName text(50),
  domainValue text(50),
  sort text(11),
  fullpath text(80),
  stamp text(20),
  PRIMARY KEY ("domainId")
);

CREATE TABLE a_functions (
	funcId TEXT(20) NOT NULL,
	funcName TEXT(200),
	url TEXT(500),
	css TEXT(500),
	flags TEXT(2),
	fullpath TEXT(50),
	parentId TEXT(20),
	sibling INTEGER DEFAULT 1,
	CONSTRAINT pk_functions PRIMARY KEY (funcId));

CREATE TABLE a_attaches (
	attId TEXT NOT NULL,
	attName TEXT,
	uri TEXT,
	busiTbl TEXT,
	busiId TEXT,
	oper TEXT,
	optime DATETIME,
	CONSTRAINT a_attaches_PK PRIMARY KEY (attId)
);


CREATE TABLE a_orgs (
	orgId text(20) NOT NULL,
	orgName text(50),
	orgType text(40) NOT NULL, -- a reference to a_domain.domainId (parent = '02')
	PRIMARY KEY (orgId)
);

CREATE TABLE a_role_func(
	roleId TEXT(20) not null,
	funcId TEXT(20) not null,
	PRIMARY KEY (roleId, funcId)
);

CREATE TABLE a_roles(
	roleId TEXT(20) not null,
	roleName TEXT(50),
	remarks TEXT(200),
	orgId TEXT(20) not null,
	CONSTRAINT a_roles_pk PRIMARY KEY (roleId)
);

CREATE TABLE a_users(
	userId TEXT(20) not null,
	userName TEXT(50) not null,
	roleId TEXT(20),
	orgId TEXT(20),
	nationId TEXT(20),
	birthday DATE,
	pswd TEXT NOT NULL,
	iv TEXT(200),
	CONSTRAINT a_users_pk PRIMARY KEY (userId)
);

CREATE TABLE oz_autoseq (
  sid text(50),
  seq INTEGER,
  remarks text(200),
  CONSTRAINT oz_autoseq_pk PRIMARY KEY (sid)
);

insert into oz_autoseq (sid, seq, remarks) values
	('a_logs.logId', 0, 'log'),
	('a_users.userId', 64, 'user'),
	('a_roles.roleId', 64 * 64, 'role'),
	('a_orgs.orgId', 64 * 64 * 64, 'orgniation'),
	('a_attaches.attId', 0, 'attachement');

delete from a_functions;

insert into a_functions ( funcId, funcName, url, css, flags, fullpath, parentId, sibling )
values
	('sys', 'System', null, '', '1', '1 sys', null, 1),
	('sys-domain', 'Domain Settings', 'views/sys/domain/domain.html', '', '1', '1 sys.1 domain', 'sys', 1),
	('sys-role', 'Role Manage', 'views/sys/role/roles.html', '', '1', '1 sys.2 role', 'sys', 2),
	('sys-org', 'Orgnization Manage', 'views/sys/org/orgs.html', '', '1', '1 sys.3 org', 'sys', 3),
	('sys-uesr', 'Uesr Manage', 'views/sys/user/users.html', '', '1', '1 sys.4 user', 'sys', 4),
	('sys-wf', 'Workflow Settings', 'views/sys/workflow/workflows.html', '', '1', '1 sys.5 wf', 'sys', 5) ;

-- v 1.1
insert into a_functions ( funcId, funcName, url, css, flags, fullpath, parentId, sibling )
values
	('sys-1.1', 'System v1.1', null, '', '1', '2 sys-1.1', null, 2),
	('sys-uesr-1.1', 'Uesr Manage', 'views/sys/user/users-1.1.html', '', '1', '2 sys-1.1.4 user', 'sys-1.1', 4)
;

insert into a_domain (domainId, parentId, domainValue, domainName, sort, fullpath)
values
	('0',   null, 't-org', 'org type',  1, '0'),
	('001', '0',  'AAAAA', '5 START', 1, '0.1 001'),
	('002', '0',  'AAAA ', '4 START', 2, '0.2 002'),
	('003', '0',  'AAA  ', '3 START', 3, '0.3 003'),
	('004', '0',  'AA   ', '2 START', 4, '0.4 004'),
	('005', '0',  'A    ', '1 START', 5, '0.5 005'),
	('nation', null,  't-nation', 'nations',  2, '1'),
	('N01', 'nation', 'CHN', 'Republic of China',  1, '1.1 CN'),
	('N02', 'nation', 'USA',  'United States of America',  2, '1.2 US'),
	('N03', 'nation', 'ISR',  'Israel',  3, '1.3 IS');

insert into a_orgs (orgId, orgName, orgType) values
	('001', 'Funders', ''),
	('002', 'Mossad', 'AAAA'),
	('003', 'MI6', 'AAA'),
	('004', 'CIA', 'AA'),
	('005', 'SVR', 'A'),
	('006', 'ChaoYang People', 'AAAAA');

insert into a_roles (roleId, roleName, remarks, orgId) values
	('r001', 'funder', 'R.C. 1911-10-10', '001'),
	('r003', 'spy', 'Anything', '002'),
	('r002', 'snooper', 'Every Where', '006');

insert into a_users (userId, userName, roleId, orgId, birthday, pswd, iv)
values
	('admin', 'Sun Yat-sen', 'r001', '001', '1866-12-12', '123456', null),
	('washinton', 'George Washinton', 'r001', '002', null, '123456', null);
