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
import { injectable } from "inversify";
import { KeyPair } from "./KeyPair";
import { storageContainer, STORAGE_TYPES } from "@symlinkde/eco-os-pk-storage";

@injectable()
export class KeyService implements PkStroageLicense.IKeyService {
  private keyRepro: PkStorage.IMongoRepository<KeyPair>;

  public constructor() {
    this.keyRepro = storageContainer.getTagged<PkStorage.IMongoRepository<KeyPair>>(
      STORAGE_TYPES.IMongoRepository,
      STORAGE_TYPES.STATE_LESS,
      false,
    );
  }

  public async addKeys(keys: MsLicense.ILicenseKeyPair): Promise<MsLicense.ILicenseKeyPair | null> {
    const checkForExistingKeys = await this.loadKeys();
    if (checkForExistingKeys !== null) {
      return null;
    }

    await this.keyRepro.create(new KeyPair(keys));
    return keys;
  }

  public async loadKeys(): Promise<MsLicense.ILicenseKeyPair | null> {
    const result = await this.keyRepro.find({ tagName: MsLicense.LicenseTags.key });
    if (result === undefined || result === null || result.length < 1) {
      return null;
    }

    return result[0];
  }

  public async removeKeys(): Promise<boolean> {
    return await this.keyRepro.deleteMany({ tagName: MsLicense.LicenseTags.key });
  }
}
