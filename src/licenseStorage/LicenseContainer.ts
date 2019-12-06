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



import "reflect-metadata";
import { Container } from "inversify";
import Config from "config";
import { bootstrapperContainer } from "@symlinkde/eco-os-pk-core";
import { PkStroageLicense } from "@symlinkde/eco-os-pk-models";
import { LICENSE_TYPES } from "./LicenseTypes";
import { LicenseService } from "./LicenseService";
import { KeyService } from "./KeyService";
import { storageContainer, STORAGE_TYPES } from "@symlinkde/eco-os-pk-storage";

const licenseContainer = new Container();
licenseContainer
  .bind<PkStroageLicense.ILicenseService>(LICENSE_TYPES.ILicenseService)
  .toDynamicValue(() => {
    return new LicenseService();
  })
  .inSingletonScope();
licenseContainer
  .bind<PkStroageLicense.IKeyService>(LICENSE_TYPES.IKeyService)
  .toDynamicValue(() => {
    return new KeyService();
  })
  .inSingletonScope();
export { licenseContainer };
