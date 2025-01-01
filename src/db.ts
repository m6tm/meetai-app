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

interface UserModel {
  id: number;
  name: string;
  age: number;
}

interface LocaleModel {
  id: number;
  locale: 'en' | 'fr';
}

const db = new Dexie('meetai') as Dexie & {
  user: EntityTable<UserModel, 'id'>;
  locale: EntityTable<LocaleModel, 'id'>;
};

db.version(1).stores({
  user: '++id, email, password',
  locale: '++id, locale',
});

export type { UserModel, LocaleModel };
export { db };