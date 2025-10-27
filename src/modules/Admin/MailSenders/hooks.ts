import { MailSender } from "@/core/types/models"
import { BaseCrudHooks } from "@/core/ui-datahooks"
import { MailSendersService } from "./service"
import { MailSendersStore } from "./store"

export class MailSendersHooks extends BaseCrudHooks<MailSender>(MailSendersService, MailSendersStore, { key: 'MailSender' }) { }
