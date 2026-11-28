
import argparse
from pathlib import Path
from typing import cast

from anson.io.odysz.anson import Anson

from anson.io.odysz.common import LangExt
from restypes import HtmlRes, LangRes, OrgRes

Anson.add_package('restypes')

def printlang(r: LangRes):
    print(f'[{r.market}] {r.lang}:\n\t', 'synodes', [f'{o.org}: {o.posix}; {o.win32}' for o in r.orgs], r.upgrade_hlp)


def printHtmlRes(res: HtmlRes):
    print('echo points:', res.echo_points)

    for lang in res.langs:
        printlang(lang)
    return res


def load(fp: str) -> HtmlRes:
    res = cast(HtmlRes, Anson.from_file('res.json' if Path('res.json').exists() else 'res.github.json'))
    printHtmlRes(res)
    return res


def parseFilenames(distdir: str, res: HtmlRes):
    from semanticshare.io.oz.invoke import SynodeTask
    # parse file names according to SynodeTask's nameing convension.
    # We need to add to each naming pattern there a reversion regex.
    return {"alpha": {"pmking": {}, "closed-test": {}, "inforise": {}, "qqhome": {}}}

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="Generate resource-tree manifest.json.")
    parser.add_argument("--res", required=True, type=Path)

    args = parser.parse_args()

    res = load(args.res)

    reverse_ip  = '' # ping the res.echo_pints
    revers_port = 1984 # ask user

    downlod_files: dict[str, OrgRes] = parseFilenames(res.dist_dir, res)  
    ''' e.g. {"alpha": {"pmking": {"linux": "synode-0.8.3-linux-pmking.tar.gz"}}} '''

    for lang in res.langs:
        for o_res in lang.orgs: # Natually filter out resources of org not required in res.json.
            # fileter org's resources
            if LangExt.isblank(o_res.org): continue

            if lang.market in downlod_files and o_res.org in downlod_files[lang.market]:
                dist_orgres = downlod_files[lang.market][o_res.org]
                if 'linux' in dist_orgres:
                    o_res.linux = dist_orgres.linux
                if 'win32' in dist_orgres:
                    o_res.win32 = downlod_files[lang.market][o_res.org].win32
                if 'macos' in dist_orgres:
                    o_res.macos = downlod_files[lang.market][o_res.org].macos

        lang.landing = f'{reverse_ip} : {revers_port}' # for langding page's qr code - fallback to this if js failed.

        pth: str = Path(res.index_dir) / (lang.lang if lang.lang != 'en' else '') / 'res.json'
        print(pth)
        lang.toFile(pth)
