import { IPaymentModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { initialize } from "../../../../src/initialize"
import { DB_URL, MikroOrmWrapper } from "../../../utils"
import { createPaymentCollections } from "../../../__fixtures__/payment-collection"

jest.setTimeout(30000)

describe("Payment Module Service", () => {
  let service: IPaymentModuleService
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PAYMNET_DB_SCHEMA,
      },
    })

    await createPaymentCollections(repositoryManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should throw an error when required params are not passed", async () => {
      let error = await service
        .createPaymentCollection([
          {
            amount: 200,
            region_id: "req_123",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.currency_code is required, 'undefined' found"
      )

      error = await service
        .createPaymentCollection([
          {
            currency_code: "USD",
            region_id: "req_123",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.amount is required, 'undefined' found"
      )

      error = await service
        .createPaymentCollection([
          {
            currency_code: "USD",
            amount: 200,
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.region_id is required, 'undefined' found"
      )
    })

    it("should create a payment collection successfully", async () => {
      const [createdPaymentCollection] = await service.createPaymentCollection([
        { currency_code: "USD", amount: 200, region_id: "reg_123" },
      ])

      expect(createdPaymentCollection).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          status: "not_paid",
          payment_providers: [],
          payment_sessions: [],
          payments: [],
          currency_code: "USD",
          amount: 200,
        })
      )
    })
  })

  describe("delete", () => {
    it("should delete a Payment Collection", async () => {
      let collection = await service.listPaymentCollections({
        id: ["pay-col-id-1"],
      })

      expect(collection.length).toEqual(1)

      await service.deletePaymentCollection(["pay-col-id-1"])

      collection = await service.listPaymentCollections({
        id: ["pay-col-id-1"],
      })

      expect(collection.length).toEqual(0)
    })
  })

  describe("list", () => {
    it("should list and count Payment Collection", async () => {
      let [collections, count] = await service.listAndCountPaymentCollections()

      expect(count).toEqual(3)

      expect(collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "pay-col-id-1",
            amount: 100,
            region_id: "region-id-1",
            currency_code: "usd",
          }),
          expect.objectContaining({
            id: "pay-col-id-2",
            amount: 200,
            region_id: "region-id-1",
            currency_code: "usd",
          }),
          expect.objectContaining({
            id: "pay-col-id-3",
            amount: 300,
            region_id: "region-id-2",
            currency_code: "usd",
          }),
        ])
      )
    })

    it("should list Payment Collections by region_id", async () => {
      let collections = await service.listPaymentCollections(
        {
          region_id: "region-id-1",
        },
        { select: ["id", "amount", "region_id"] }
      )

      expect(collections.length).toEqual(2)

      expect(collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "pay-col-id-1",
            amount: 100,
            region_id: "region-id-1",
          }),
          expect.objectContaining({
            id: "pay-col-id-2",
            amount: 200,
            region_id: "region-id-1",
          }),
        ])
      )
    })

    it("should list Payment Collections by id", async () => {
      let collections = await service.listPaymentCollections(
        {
          id: "pay-col-id-1",
        },
        { select: ["id", "amount"] }
      )

      expect(collections.length).toEqual(1)

      expect(collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "pay-col-id-1",
            amount: 100,
          }),
        ])
      )
    })
  })
})