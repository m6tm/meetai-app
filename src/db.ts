/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import Dexie, { type EntityTable } from 'dexie';
import { LanguageType } from './types/definitions';

interface UserModel {
  id: number;
  name: string;
  age: number;
}

interface LocaleModel {
  id: number;
  locale: LanguageType;
}

interface PreferencesModel {
  id: number;
  audio: boolean;
  video: boolean;
}

const db = new Dexie('meetai') as Dexie & {
  user: EntityTable<UserModel, 'id'>;
  locale: EntityTable<LocaleModel, 'id'>;
  preferences: EntityTable<PreferencesModel, 'id'>;
};

db
  .version(1).stores({
    user: '++id, email, password',
    locale: '++id, locale',
  })

db.version(2).stores({
  user: '++id, email, password',
  locale: '++id, locale',
  preferences: '++id, audio, video',
})

export type { UserModel, LocaleModel, PreferencesModel };
export { db };