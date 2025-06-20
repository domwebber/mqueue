import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class SQLEdgeContainer extends GenericContainer {
  public static SQL_PORT = 1433;

  constructor(
    protected _password: string,
    image = process.env.ASB_IMAGE || "mcr.microsoft.com/azure-sql-edge:latest",
  ) {
    super(image);

    this.withExposedPorts(SQLEdgeContainer.SQL_PORT)
      .withEnvironment({
        MSSQL_SA_PASSWORD: this._password,
        ACCEPT_EULA: "Y",
      })
      .withWaitStrategy(Wait.forLogMessage(/Starting up database/))
      .withStartupTimeout(80_000)
      .withNetworkAliases("broker");
  }

  public override async start(): Promise<StartedSQLEdgeContainer> {
    return new StartedSQLEdgeContainer(await super.start(), this._password);
  }
}

export class StartedSQLEdgeContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(
    started: StartedTestContainer,
    protected _password: string,
  ) {
    super(started);
  }

  public getPassword(): string {
    return this._password;
  }

  public getSQLPort(): number {
    return this.getMappedPort(SQLEdgeContainer.SQL_PORT);
  }

  // public getASBUrl(): string {
  //   return `Endpoint=sb://${this.useAlias ? "activemq" : this.getHost()}:${this.getAmqpPort()};SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;`;
  // }
}
