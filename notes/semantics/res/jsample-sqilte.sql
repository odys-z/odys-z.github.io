
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
	birthday DATE,
	pswd TEXT NOT NULL,
	iv TEXT(200),
	CONSTRAINT a_users_pk PRIMARY KEY (userId)
);

insert into a_functions ( funcId, funcName, url, css, flags, fullpath, parentId, sibling )
values
('sys', 'System', null, '', '1', '1 sys', null, 1),
('sys-domain', 'Domain Settings', 'views/sys/domain.html', '', '1', '1 sys.1 domain', 'sys', 1),
('sys-role', 'Role Manage', 'views/sys/roles.html', '', '1', '1 sys.2 role', 'sys', 2),
('sys-org', 'Orgnization Manage', 'views/sys/orgs.html', '', '1', '1 sys.3 org', 'sys', 3),
('sys-uesr', 'Uesr Manage', 'views/sys/users.html', '', '1', '1 sys.4 user', 'sys', 4),
('sys-wf', 'Workflow Settings', 'views/sys/workflows.html', '', '1', '1 sys.5 wf', 'sys', 5),
;

insert into a_users (userId, userName, roleId, orgId, birthday, pswd, iv)
values ('admin', 'Sun Yat-sen', 'r001', '001', '1866-12-12', '123456', null);
