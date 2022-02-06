import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { GetItemInput, KeyConditions } from "aws-sdk/clients/dynamodb";
import { dtypeResolver } from "../dtype";
import { CommandBuilder } from "./command.builder";


export class GetItemCommandBuilder<TEntity> extends CommandBuilder<TEntity, GetItemCommand> {

  constructor(
    private readonly partitionKeyValue: string,
    private readonly sortKeyValue: string,
  ) {
    super();
  }

  toCommand() {
    const input: GetItemInput = {
      "TableName": "",

      Key: {
        PK: dtypeResolver(this.partitionKeyValue),
        SK: dtypeResolver(this.sortKeyValue),
      } as any,
    }

    return new GetItemCommand(input);
  }
}
