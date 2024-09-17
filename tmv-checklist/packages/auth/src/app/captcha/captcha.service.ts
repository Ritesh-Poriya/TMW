import { Inject, Injectable } from '@nestjs/common';
import { RE_CAPTCHA_ENTERPRISE_CONFIG } from './constants';
import { IReCaptchaEnterpriseConfig, ReCaptchaActionType } from './@types';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class CaptchaService {
  constructor(
    @Inject(RE_CAPTCHA_ENTERPRISE_CONFIG)
    private config: IReCaptchaEnterpriseConfig,
  ) {}

  @logAround()
  public async validateTokenForAction(
    token: string,
    action: ReCaptchaActionType,
  ): Promise<boolean> {
    const client = new RecaptchaEnterpriseServiceClient({
      projectId: this.config.projectID,
      keyFilename: this.config.serviceAccountPath,
    });
    const projectPath = client.projectPath(this.config.projectID);

    const request = {
      assessment: {
        event: {
          token,
          siteKey: this.config.recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    return (
      response.tokenProperties.valid &&
      response.tokenProperties.action === action &&
      response.riskAnalysis.score >= this.config.acceptableScoreValue
    );
  }
}
