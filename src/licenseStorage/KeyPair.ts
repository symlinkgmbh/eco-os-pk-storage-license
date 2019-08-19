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



import { MsLicense } from "@symlinkde/eco-os-pk-models";

export class KeyPair implements MsLicense.ILicenseKeyPair {
  public privateKey: string;
  public publicKey: string;
  public tagName: MsLicense.LicenseTags;

  constructor(license: MsLicense.ILicenseKeyPair) {
    this.privateKey = license.privateKey;
    this.publicKey = license.publicKey;
    this.tagName = license.tagName;
  }

  public getPrivateKey(): string {
    return this.privateKey;
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  public getTagName(): string {
    return this.tagName;
  }

  public setPrivateKey(privateKey: string): void {
    this.privateKey = privateKey;
  }

  public setPublicKey(publicKey: string): void {
    this.publicKey = publicKey;
  }

  public setTageName(tagName: MsLicense.LicenseTags): void {
    this.tagName = tagName;
  }
}
