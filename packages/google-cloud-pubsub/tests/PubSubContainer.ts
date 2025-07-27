import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class PubSubContainer extends GenericContainer {
  public static PUBSUB_PORT = 8085;

  constructor(
    image = process.env.PUBSUB_IMAGE ||
      // "gcr.io/google.com/cloudsdktool/cloud-sdk" ||
      "gcr.io/google.com/cloudsdktool/google-cloud-cli",
  ) {
    super(image);

    this.withExposedPorts(PubSubContainer.PUBSUB_PORT)
      .withCommand([
        "/bin/bash",
        "-c",
        "gcloud beta emulators pubsub start --host-port 0.0.0.0:8085",
      ])
      .withWaitStrategy(Wait.forLogMessage(/.*Server started.*$/, 1))
      // .withStartupTimeout(120_000)
      .withNetworkAliases("broker");
  }

  public override async start(): Promise<StartedPubSubContainer> {
    return new StartedPubSubContainer(await super.start());
  }
}

export class StartedPubSubContainer extends AbstractStartedContainer {
  public useAlias = false;

  constructor(started: StartedTestContainer) {
    super(started);
  }

  public getPubSubPort(): number {
    return this.getMappedPort(PubSubContainer.PUBSUB_PORT);
  }

  public getEndpoint(): string {
    return `${this.useAlias ? "activemq" : this.getHost()}:${this.getPubSubPort()}`;
  }
}
