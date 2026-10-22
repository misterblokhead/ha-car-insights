from car_insights import mqtt_out


class FakeClient:
    def __init__(self, *a):
        self.creds = None
        self.published = []

    def username_pw_set(self, u, p):
        self.creds = (u, p)

    def connect_async(self, host, port):
        pass

    def loop_start(self):
        pass

    def publish(self, topic, payload, qos, retain):
        self.published.append((topic, payload, qos, retain))


def test_publish_and_credentials(monkeypatch):
    monkeypatch.setattr(mqtt_out.mqtt, "Client", FakeClient)
    out = mqtt_out.MqttOut("h", 1883, "", "")
    out.publish([("t", "p")])
    assert out._c.published == [("t", "p", 1, True)] and out._c.creds is None
    assert mqtt_out.MqttOut("h", 1883, "u", "pw")._c.creds == ("u", "pw")
