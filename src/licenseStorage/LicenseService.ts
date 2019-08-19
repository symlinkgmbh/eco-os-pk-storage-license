/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import { PkStroageLicense, PkStorage, MsLicense } from "@symlinkde/eco-os-pk-models";
import { EncryptedLicense } from "./License";
import { injectable } from "inversify";
import { STORAGE_TYPES, storageContainer } from "@symlinkde/eco-os-pk-storage";

@injectable()
export class LicenseService implements PkStroageLicense.ILicenseService {
  private licenseRepro: PkStorage.IMongoRepository<EncryptedLicense>;

  public constructor() {
    this.licenseRepro = storageContainer.getTagged<PkStorage.IMongoRepository<EncryptedLicense>>(
      STORAGE_TYPES.IMongoRepository,
      STORAGE_TYPES.STATE_LESS,
      false,
    );
  }

  public async addLicense(license: MsLicense.IEncryptedLicense): Promise<MsLicense.IEncryptedLicense | null> {
    const checkForExistingLicense = await this.loadLicense();
    if (checkForExistingLicense !== null) {
      return null;
    }

    await this.licenseRepro.create(new EncryptedLicense(license));
    return license;
  }

  public async loadLicense(): Promise<MsLicense.IEncryptedLicense | null> {
    const result = await this.licenseRepro.find({ tagName: MsLicense.LicenseTags.license });
    if (result === undefined || result === null || result.length < 1) {
      return null;
    }
    return result[0];
  }

  public async removeLicense(): Promise<boolean> {
    return await this.licenseRepro.deleteMany({ tagName: MsLicense.LicenseTags.license });
  }
}
