import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class ElasticMQContainer extends GenericContainer {
  public static REST_PORT = 9324;
  public static UI_PORT = 9325;

  constructor(
    image = process.env.ELASTICMQ_IMAGE ||
      "softwaremill/elasticmq-native:latest",
  ) {
    super(image);

    this.withExposedPorts(
      ElasticMQContainer.REST_PORT,
      ElasticMQContainer.UI_PORT,
    )
      .withCopyContentToContainer([
        {
          content: [
            "# the include should be done only once, at the beginning of the custom configuration file",
            'include classpath("application.conf")',
            "",
            "queues {",
            "  queue1 {",
            "    defaultVisibilityTimeout = 10 seconds",
            "    delay = 5 seconds",
            "    receiveMessageWait = 0 seconds",
            // "    deadLettersQueue {",
            // '      name = "queue1-dead-letters"',
            // "      maxReceiveCount = 3 // from 1 to 1000",
            // "    }",
            "    fifo = false",
            "    contentBasedDeduplication = false",
            // '    copyTo = "audit-queue-name"',
            // '    moveTo = "redirect-queue-name"',
            "    tags {",
            '      tag1 = "tagged1"',
            '      tag2 = "tagged2"',
            "    }",
            "  }",
            // "  queue1-dead-letters { }",
            // "  audit-queue-name { }",
            // "  redirect-queue-name { }",
            "}",
          ].join("\n"),
          target: "/opt/elasticmq.conf",
        },
      ])
      .withWaitStrategy(Wait.forLogMessage(/ElasticMQ server \(.*?\) started/))
      .withStartupTimeout(60_000)
      .withNetworkAliases("broker");
  }

  public override async start(): Promise<StartedElasticMQContainer> {
    return new StartedElasticMQContainer(await super.start());
  }
}

export class StartedElasticMQContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(started: StartedTestContainer) {
    super(started);
  }

  public getRestPort(): number {
    return this.getMappedPort(ElasticMQContainer.REST_PORT);
  }

  public getUiPort(): number {
    return this.getMappedPort(ElasticMQContainer.UI_PORT);
  }

  public getSQSUrl(): string {
    return `http://${this.useAlias ? "elasticmq" : this.getHost()}:${this.getRestPort()}`;
  }
}
