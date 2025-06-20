import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class ActiveMQContainer extends GenericContainer {
  public static WEB_CONSOLE_PORT = 8161;
  public static TCP_PORT = 61616;
  public static HORNETQ_STOMP_PORT = 5445;
  public static AMQP_PORT = 5672;
  public static STOMP_PORT = 61613;
  public static MQTT_PORT = 1883;
  public static WS_PORT = 61614;

  public static DEFAULT_USER = "guest";
  public static DEFAULT_PASSWORD = "guest";

  constructor(
    private password: string = ActiveMQContainer.DEFAULT_PASSWORD,
    private user: string = ActiveMQContainer.DEFAULT_USER,
    image = process.env.RABBITMQ_IMAGE ||
      "apache/activemq-artemis:latest-alpine",
  ) {
    super(image);

    this.withExposedPorts(
      ActiveMQContainer.WEB_CONSOLE_PORT,
      ActiveMQContainer.TCP_PORT,
      ActiveMQContainer.HORNETQ_STOMP_PORT,
      ActiveMQContainer.AMQP_PORT,
      ActiveMQContainer.STOMP_PORT,
      ActiveMQContainer.MQTT_PORT,
      ActiveMQContainer.WS_PORT,
    )
      .withEnvironment({
        ARTEMIS_USER: this.user,
        ARTEMIS_PASSWORD: this.password,
        ANONYMOUS_LOGIN: "true",
      })
      .withWaitStrategy(Wait.forLogMessage(/.*HTTP Server started.*/, 1))
      .withStartupTimeout(60_000)
      .withNetworkAliases("activemq");
  }

  public override async start(): Promise<StartedActiveMQContainer> {
    return new StartedActiveMQContainer(
      await super.start(),
      this.user,
      this.password,
    );
  }
}

export class StartedActiveMQContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(
    started: StartedTestContainer,
    private user: string,
    private password: string,
  ) {
    super(started);
  }

  public getUser() {
    return this.user;
  }

  public getPassword() {
    return this.password;
  }

  public getWebConsolePort() {
    return this.getMappedPort(ActiveMQContainer.WEB_CONSOLE_PORT);
  }

  public getTcpPort() {
    return this.getMappedPort(ActiveMQContainer.TCP_PORT);
  }

  public getHornetqPort() {
    return this.getMappedPort(ActiveMQContainer.HORNETQ_STOMP_PORT);
  }

  public getAmqpPort() {
    return this.getMappedPort(ActiveMQContainer.AMQP_PORT);
  }

  public getStompPort() {
    return this.getMappedPort(ActiveMQContainer.STOMP_PORT);
  }

  public getMqttPort() {
    return this.getMappedPort(ActiveMQContainer.MQTT_PORT);
  }

  public getWsPort() {
    return this.getMappedPort(ActiveMQContainer.WS_PORT);
  }

  public getStompUrl(): string {
    return `http://${this.useAlias ? "activemq" : this.getHost()}:${this.getStompPort()}?protocols=STOMP;connectionTtl=20000`;
    // return `stomp://${this.getUser()}:${this.getPassword()}@${this.useAlias ? "activemq" : this.getHost()}:${this.getStompPort()}`;
  }
}
