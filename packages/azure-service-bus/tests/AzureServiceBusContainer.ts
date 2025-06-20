import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class AzureServiceBusContainer extends GenericContainer {
  public static AMQP_PORT = 5672;
  public static UI_PORT = 5300;

  constructor(
    sqlserver: { host: string; password: string },
    image = process.env.ASB_IMAGE ||
      "mcr.microsoft.com/azure-messaging/servicebus-emulator:latest",
  ) {
    super(image);

    this.withExposedPorts(
      AzureServiceBusContainer.AMQP_PORT,
      AzureServiceBusContainer.UI_PORT,
    )
      .withEnvironment({
        SQL_SERVER: sqlserver.host,
        MSSQL_SA_PASSWORD: sqlserver.password,
        ACCEPT_EULA: "Y",
        SQL_WAIT_INTERVAL: "0",
      })
      .withCopyFilesToContainer([
        {
          source: "./tests/asb-config.json",
          target: "/ServiceBus_Emulator/ConfigFiles/Config.json",
        },
      ])
      .withWaitStrategy(
        Wait.forLogMessage(/Emulator Service is Successfully Up/),
      )
      .withStartupTimeout(60_000)
      .withNetworkAliases("broker");
  }

  public override async start(): Promise<StartedAzureServiceBusContainer> {
    return new StartedAzureServiceBusContainer(await super.start());
  }
}

export class StartedAzureServiceBusContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(started: StartedTestContainer) {
    super(started);
  }

  public getAmqpPort(): number {
    return this.getMappedPort(AzureServiceBusContainer.AMQP_PORT);
  }

  public getUiPort(): number {
    return this.getMappedPort(AzureServiceBusContainer.UI_PORT);
  }

  public getASBUrl(): string {
    return `Endpoint=sb://${this.useAlias ? "activemq" : this.getHost()}:${this.getAmqpPort()};SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;`;
  }
}
