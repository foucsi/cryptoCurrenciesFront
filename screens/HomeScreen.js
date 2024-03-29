import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { logout } from "../reducers/users";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Fontisto } from "@expo/vector-icons";
import fetchIp from "../fetchIp.json";

export default function HomeScreen({ navigation }) {
  const [cryptos, setCryptos] = useState([]);
  const users = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [countCrypto, setCountCrypto] = useState(0);
  const [displayCrypto, setDisplayCrypto] = useState("");

  const urlLinkedin = "https://www.linkedin.com/in/julien-foucart-333a40251/";
  const urlGit = "https://github.com/Foucsi";

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${displayCrypto}&page=1&sparkline=false`;

  const fetchData = async () => {
    const res = await fetch(`${url}`);
    const data = await res.json();
    data ? setCryptos(data) : console.log(data);
  };

  const countCryptoData = async () => {
    const res = await fetch(
      `http://${fetchIp.myIp}:3000/users/getUserByToken/${users.token}`
    );
    const data = await res.json();
    {
      data && setCountCrypto(data.cryptosList.length);
    }
  };

  useEffect(() => {
    fetchData().catch(console.error);
    countCryptoData();
  }, [users.crypto]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Sign");
  };

  const filtered = cryptos.filter((cry) => cry.name.includes(displayCrypto));

  const listingCrypto = filtered.map((crypt, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate("Crypto", {
            crypto: crypt,
          })
        }
      >
        <View
          style={{
            padding: 5,
            height: 120,
            width: 120,
            marginTop: 10,
            marginLeft: 10,
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: 5,
            backgroundColor:
              crypt.price_change_percentage_24h > 0 ? "#6DB76B" : "#E7595D",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
            {crypt.symbol.toUpperCase()}
          </Text>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            ${crypt.current_price}
          </Text>
          <Image
            source={{ uri: crypt.image }}
            style={{ height: 40, width: 40 }}
          />
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 28, color: "#D4D4D4", paddingTop: 70 }}>
        COIN360
      </Text>

      <View
        style={{
          alignItems: "center",
          height: 60,
          justifyContent: "space-evenly",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text style={{ color: "#fff" }}>
            Welcome {users.username.charAt(0).toUpperCase()}
            {users.username.slice(1)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Favorites", {
                crypto: cryptos,
              })
            }
          >
            <Fontisto
              name="favorite"
              size={24}
              color="#fff"
              style={{ paddingLeft: 10 }}
            />
          </TouchableOpacity>
          <Text style={{ color: "#fff" }}>({countCrypto})</Text>
        </View>

        <AntDesign
          name="logout"
          size={24}
          color="#fff"
          onPress={() => handleLogout()}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: 300,
          paddingBottom: 20,
          paddingTop: 10,
        }}
      >
        <TextInput
          value={displayCrypto}
          onChangeText={(value) => setDisplayCrypto(value)}
          placeholderTextColor={"#fff"}
          placeholder="Search..."
          style={{
            borderColor: "#fff",
            borderWidth: 0.3,
            padding: 5,
            color: "#fff",
            width: 250,
          }}
        />
      </View>
      <ScrollView>
        <View
          style={{
            marginTop: 20,
            height: "100%",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          {listingCrypto ? listingCrypto : "Aucune données récuperées"}
        </View>
      </ScrollView>

      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <TouchableOpacity>
          <FontAwesome
            name="refresh"
            size={36}
            color="#fff"
            onPress={() => {
              countCryptoData();
              fetchData();
            }}
          />
        </TouchableOpacity>
        <View style={{ paddingTop: 40, paddingBottom: 10, height: 160 }}>
          <Text style={{ color: "#fff", fontSize: 12, paddingBottom: 10 }}>
            Application created by Julien Foucart
          </Text>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity onPress={() => Linking.openURL(urlGit)}>
              <AntDesign name="github" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(urlLinkedin)}>
              <AntDesign name="linkedin-square" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#161817",
  },
});
