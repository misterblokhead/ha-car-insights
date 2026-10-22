import paho.mqtt.client as mqtt


class MqttOut:
    def __init__(self, host: str, port: int, username: str, password: str):
        self._c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        if username:
            self._c.username_pw_set(username, password)
        self._c.connect_async(host, port)
        self._c.loop_start()

    def publish(self, messages: list[tuple[str, str]]) -> None:
        for topic, payload in messages:  # retained: HA and restarts must see the last state and discovery
            self._c.publish(topic, payload, qos=1, retain=True)
