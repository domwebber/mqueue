import {
  AbstractStartedContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import type { StartedTestContainer } from "testcontainers";

export default class MosquittoContainer extends GenericContainer {
  public static MQTT_PORT = 1883;
  public static DEFAULT_USER = "guest";
  public static DEFAULT_PASSWORD = "password";

  constructor(
    image = process.env.MOSQUITTO_IMAGE || "eclipse-mosquitto:latest",
  ) {
    super(image);

    this.withExposedPorts(MosquittoContainer.MQTT_PORT)
      .withWaitStrategy(
        Wait.forLogMessage(/mosquitto version \d+.\d+.\d+ running/),
      )
      .withCopyContentToContainer([
        {
          content: [
            "listener 1883 0.0.0.0",
            "allow_anonymous true",
            "password_file /mosquitto/config/passwd",
          ].join("\n"),
          target: "/mosquitto/config/mosquitto.conf",
        },
        {
          content: [
            // See DEFAULT_USER and DEFAULT_PASSWORD
            "guest:$7$1$sy45mfgHqvp9h7VS$CCqVS31nddGUeeIblCgr32bZoNud+9r/0O0vhbLBTc8WNApPmuYsYVU9iffVYxYwOBBgxkg17qxdOlsxwuopjQ==",
          ].join("\n"),
          target: "/mosquitto/config/passwd",
          mode: parseInt("0700", 8),
        },
      ])
      .withStartupTimeout(50_000)
      .withNetworkAliases("mosquitto");
  }

  public override async start(): Promise<StartedMosquittoContainer> {
    return new StartedMosquittoContainer(
      await super.start(),
      MosquittoContainer.DEFAULT_USER,
      MosquittoContainer.DEFAULT_PASSWORD,
    );
  }
}

export class StartedMosquittoContainer extends AbstractStartedContainer {
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

  public getMqttPort(): number {
    return this.getMappedPort(MosquittoContainer.MQTT_PORT);
  }

  public getMqttUrl(): string {
    // return "mqtt://test.mosquitto.org";
    return `mqtt://${this.getUser()}:${this.getPassword()}@${this.useAlias ? "broker" : this.getHost()}:${this.getMqttPort()}`;
  }
}
