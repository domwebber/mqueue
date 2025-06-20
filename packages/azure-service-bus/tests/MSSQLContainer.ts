import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class MSSQLContainer extends GenericContainer {
  public static MSSQL_PORT = 1433;

  public static DEFAULT_DATABASE = "master";
  public static DEFAULT_USERNAME = "sa";
  public static DEFAULT_PASSWORD = "Passw0rd";

  constructor(
    image = process.env.MSSQL_IMAGE ||
      "mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04",
  ) {
    super(image);

    this.withExposedPorts(MSSQLContainer.MSSQL_PORT)
      .withEnvironment({
        MSSQL_SA_PASSWORD: MSSQLContainer.DEFAULT_PASSWORD,
        SQLCMDPASSWORD: MSSQLContainer.DEFAULT_PASSWORD,
        MSSQL_TCP_PORT: String(MSSQLContainer.MSSQL_PORT),
        ACCEPT_EULA: "Y",
      })
      .withWaitStrategy(Wait.forLogMessage(/.*Recovery is complete.*/))
      .withStartupTimeout(120_000)
      .withNetworkAliases("sqledge");
  }

  public override async start(): Promise<StartedMSSQLContainer> {
    return new StartedMSSQLContainer(
      await super.start(),
      MSSQLContainer.DEFAULT_DATABASE,
      MSSQLContainer.DEFAULT_USERNAME,
      MSSQLContainer.DEFAULT_PASSWORD,
    );
  }
}

export class StartedMSSQLContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(
    started: StartedTestContainer,
    protected _database: string,
    protected _username: string,
    protected _password: string,
  ) {
    super(started);
  }

  public getUsername(): string {
    return this._username;
  }

  public getPassword(): string {
    return this._password;
  }

  public getDatabase(): string {
    return this._database;
  }

  public getMSSQLPort(): number {
    return this.getMappedPort(MSSQLContainer.MSSQL_PORT);
  }

  public getConnectionUri(secure = false): string {
    return `Server=${this.getHost()},${this.getMSSQLPort()};Database=${this.getDatabase()};User Id=${this.getUsername()};Password=${this.getPassword()};Encrypt=${secure}`;
  }
}
