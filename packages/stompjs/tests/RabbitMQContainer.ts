import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class RabbitMQContainer extends GenericContainer {
  public static AMQP_PORT = 5672;
  public static AMQPS_PORT = 5671;
  public static DEFAULT_USER = "guest";
  public static DEFAULT_PASSWORD = "guest";
  public static DEFAULT_QUEUE_NAME = "example-queue";

  constructor(image = process.env.RABBITMQ_IMAGE || "rabbitmq:4.0.5-alpine") {
    super(image);

    this.withExposedPorts(
      RabbitMQContainer.AMQP_PORT,
      RabbitMQContainer.AMQPS_PORT,
      15674,
    )
      .withEnvironment({
        RABBITMQ_DEFAULT_USER: RabbitMQContainer.DEFAULT_USER,
        RABBITMQ_DEFAULT_PASS: RabbitMQContainer.DEFAULT_PASSWORD,
      })
      // .withEntrypoint(["docker-entrypoint.sh"])
      .withCommand([
        "sh",
        "-c",
        "rabbitmq-plugins enable --offline rabbitmq_stomp rabbitmq_web_stomp && echo 'loopback_users.guest = false' >> /etc/rabbitmq/rabbitmq.conf && echo 'web_stomp.ws_frame = binary' >> /etc/rabbitmq/rabbitmq.conf && docker-entrypoint.sh rabbitmq-server",
      ])
      .withWaitStrategy(Wait.forLogMessage("Server startup complete;"))
      .withStartupTimeout(60_000)
      .withNetworkAliases("broker");
  }

  public override async start(): Promise<StartedRabbitMQContainer> {
    return new StartedRabbitMQContainer(
      await super.start(),
      RabbitMQContainer.DEFAULT_USER,
      RabbitMQContainer.DEFAULT_PASSWORD,
      RabbitMQContainer.DEFAULT_QUEUE_NAME,
    );
  }
}

export class StartedRabbitMQContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(
    started: StartedTestContainer,
    private user: string,
    private password: string,
    private queueName: string,
  ) {
    super(started);
  }

  public getUser() {
    return this.user;
  }

  public getPassword() {
    return this.password;
  }

  public getQueueName() {
    return this.queueName;
  }

  public getAmqpPort(): number {
    return this.getMappedPort(RabbitMQContainer.AMQP_PORT);
  }

  public getAmqpsPort(): number {
    return this.getMappedPort(RabbitMQContainer.AMQPS_PORT);
  }

  public getStompUrl(): string {
    return `ws://${this.useAlias ? "broker" : this.getHost()}:${this.getMappedPort(15674)}/ws`;
  }

  public getAmqpUrl(): string {
    return `amqp://${this.getUser()}:${this.getPassword()}@${this.useAlias ? "broker" : this.getHost()}:${this.getAmqpPort()}`;
  }

  public getAmqpsUrl(): string {
    return `amqps://${this.getUser()}:${this.getPassword()}@${this.useAlias ? "broker" : this.getHost()}:${this.getAmqpsPort()}`;
  }

  public getAmqpOptions() {
    return {
      transport: "tcp" as const,
      port: this.getAmqpPort(),
      host: this.useAlias ? "broker" : this.getHost(),
      username: this.getUser(),
      password: this.getPassword(),
    };
  }

  public amqpsOptions() {
    return {
      transport: "tls" as const,
      port: this.getAmqpsPort(),
      host: this.useAlias ? "broker" : this.getHost(),
      username: this.getUser(),
      password: this.getPassword(),
    };
  }
}
