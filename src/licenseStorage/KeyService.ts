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
import Config from "config";
import { bootstrapperContainer } from "@symlinkde/eco-os-pk-core";
import { KeyPair } from "./KeyPair";
import { storageContainer, STORAGE_TYPES, AbstractBindings } from "@symlinkde/eco-os-pk-storage";

@injectable()
export class KeyService extends AbstractBindings implements PkStroageLicense.IKeyService {
  private keyRepro: PkStorage.IMongoRepository<KeyPair>;

  public constructor() {
    super(storageContainer);

    this.initDynamicBinding(
      [STORAGE_TYPES.Database, STORAGE_TYPES.Collection, STORAGE_TYPES.StorageTarget],
      [Config.get("mongo.db"), Config.get("mongo.collection"), "SECONDLOCK_MONGO_LICENSE_DATA"],
    );

    this.initStaticBinding(
      [STORAGE_TYPES.SECONDLOCK_REGISTRY_URI],
      [bootstrapperContainer.get("SECONDLOCK_REGISTRY_URI")],
    );

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
