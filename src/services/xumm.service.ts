import { Xumm } from 'xumm'
import { envs } from '../config';


class XummSercice {
  xumm: Xumm;
  constructor() {
    this.xumm = new Xumm(envs.xummApiKey || "");
    this.xumm.on("ready", () => console.log("XRPL networl Ready.."));
  }

  async logout() {
    await this?.xumm?.logout();
  }
}

const xummService = new XummSercice()

export default xummService;