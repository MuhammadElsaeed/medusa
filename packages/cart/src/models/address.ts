import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "cart_address" })
export default class Address {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string | null

  @Property({ columnType: "text", nullable: true })
  company?: string | null

  @Property({ columnType: "text", nullable: true })
  first_name?: string | null

  @Property({ columnType: "text", nullable: true })
  last_name?: string | null

  @Property({ columnType: "text", nullable: true })
  address_1?: string | null

  @Property({ columnType: "text", nullable: true })
  address_2?: string | null

  @Property({ columnType: "text", nullable: true })
  city?: string | null

  @Property({ columnType: "text", nullable: true })
  country_code?: string | null

  @Property({ columnType: "text", nullable: true })
  province?: string | null

  @Property({ columnType: "text", nullable: true })
  postal_code?: string | null

  @Property({ columnType: "text", nullable: true })
  phone?: string | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Opt<Date>

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Opt<Date>

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "caaddr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "caaddr")
  }
}
