import path from 'path';
import fs from 'fs/promises';
import Filehound from 'filehound';

const _dir = path.join(process.cwd(), 'locales');

const replaceDir = async (dir) => {
    const en = (await import(path.join(dir, 'en.js'))).default;
    const fr = (await import(path.join(dir, 'fr.js'))).default;
    await fs.writeFile(path.join(dir, 'en.js'), `export default ${JSON.stringify(en)};`);
    await fs.writeFile(
      path.join(dir, 'fr.js'),
      `export default ${JSON.stringify(fr)};`
    );
    const json = (await Filehound.create().path(dir).match('*.json').find())[0];
    if(json) fs.unlink(json);
}

(() => {
    Filehound.create()
    .path(path.join(_dir, 'utils'))
    .directory()
    .find()
    .each((x) => replaceDir(x));
})()