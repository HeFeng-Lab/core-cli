import path from "node:path"
import { $, execa } from 'execa';
import fse from "fs-extra";
import { pathExistsSync } from 'path-exists';
import { log } from "../log.js";
import { getProjectPath, readFileInfo } from "../utils.js";

export default class GitServer {
  constructor () {
    this.token = null

    this.init()
  }

  init () {
    // 读取 token
  }

  get (url, params, headers) {
    return this.service({
      method: "GET",
      url,
      params,
      headers,
    })
  }

  post (url, data, headers) {
    return this.service({
      method: "GET",
      url,
      params: {
        access_token: this.token,
      },
      data,
      headers,
    })
  }

  cloneRepository (fullName, tag = "") {
    const gitUrl = this.getRepositoryUrl(fullName)

    if (tag) {
      return $`git clone ${ gitUrl } -b ${ tag }`
    } else {
      return $`git clone ${ gitUrl }`
    }
  }

  async installDependencies (cwd, fullName) {

    const projectPath = getProjectPath(cwd, fullName);

    log.verbose("projectPath: " + projectPath)

    if (pathExistsSync(projectPath)) {
      return await execa('pnpm', ['install', '--registry=https://registry.npmmirror.com'], { cwd: projectPath });
    }
    return null;
  }

  async runRepository (cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName);
    const pkg = this.getPkgJson(projectPath)

    if (pkg) {
      const { scripts, bin, name } = pkg

      if (bin) {
        await execa('pnpm', ['install', '-g', name, "--registry=https://registry.npmmirror.com"],  {
          cwd: projectPath,
          stdout: "inherit"
        })
      }

      if (scripts && scripts.dev) {
        return execa('pnpm', ['run', 'dev'], { cwd: projectPath, stdout: 'inherit' });
      } else if (scripts && scripts.start) {
        return execa('pnpm', ['start'], { cwd: projectPath, stdout: 'inherit' });
      } else if (scripts && scripts.serve) {
        return execa('pnpm', ['run', 'serve'], { cwd: projectPath, stdout: 'inherit' });
      } else {
        log.warn("running command is not found!");
      }
    }
  }

  getPkgJson (projectPath) {
    const pkgPath = path.join(projectPath, "package.json")

    if (pathExistsSync(pkgPath)) {
      return fse.readJsonSync(pkgPath)
    }
    return null
  }
}
