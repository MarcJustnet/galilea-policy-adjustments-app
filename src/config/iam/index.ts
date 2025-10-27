import { appConfig } from '../app'

import { IAM } from '@/core/config/iam'
import type { PermissionPaths } from '@/core/config/iam/permissions/lib'

const iam = new IAM(appConfig)

export type IPermission = PermissionPaths<typeof iam.permissions>

export { iam }
