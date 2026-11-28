
from dataclasses import dataclass, MISSING

from anson.io.odysz.anson import Anson

@dataclass
class StaticResource(Anson):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        valid_fields = {f.name for f in self.__dataclass_fields__.values()}
        for key, value in kwargs.items():
            if key not in valid_fields:
                raise TypeError(
                    f"{type(self).__name__}.__init__() got an unexpected keyword"
                    f" argument '{key}'"
                )
            setattr(self, key, value)

        for f in self.__dataclass_fields__.values():
            if not hasattr(self, f.name):
                if f.default is not MISSING:
                    setattr(self, f.name, f.default)
                elif f.default_factory is not MISSING:
                    setattr(self, f.name, f.default_factory())


@dataclass
class OrgRes (StaticResource):
    org: str
    posix: str
    ''' E.g. synode-0.8.3-linux-alpha-pmking.tar.gz '''
    win32: str
    ''' E.g. synode-0.8.3-windows-alpha-pmking.tar.gz '''
    macos: str
    ''' E.g. synode-0.8.3-macos-alpha-pmking.tar.gz '''


    def __init__(self, **kwds):
        super().__init__(**kwds)
        self.posix = None
        self.win32 = None
        self.macos = None


@dataclass
class LangRes (StaticResource):
    lang: str
    market: str
    orgs: list[OrgRes]
    landing: str
    index_dir: str
    ''' E.g. portfolio-0.8, where index.html exists '''
    android: str
    desktop: str
    hlp_pdf: str
    upgrade_hlp: str

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


@dataclass
class HtmlRes (StaticResource):
    url: str
    dist_dir: str
    ''' E.g. portfolio-0.8/res/dist '''
    echo_points: list[str]
    langs: list[LangRes]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

